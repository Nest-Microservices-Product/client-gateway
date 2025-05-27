pipeline {
    agent any

    environment {
        APP_NAME = 'api-gateway'
        REPO_URL = 'https://github.com/Nest-Microservices-Product/client-gateway'
        SSH_CRED_ID = 'ssh-key-ec2'
        SSH_CRED_ID_DIEGO = 'ssh-key-ec2-diego'
        EC2_USER = 'ubuntu'
        REMOTE_PATH = '/home/ubuntu/api-gateway'
        K8S_REMOTE_PATH = '/home/ubuntu/nest-microservices/k8s/store-ms/templates/client-gateway'
        IMAGE_NAME = 'fernandoflores07081/client-gateway-prod'
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    def branch = env.GIT_BRANCH
                    if (!branch) {
                        env.DEPLOY_ENV = 'none'
                        echo "No se detectó rama, no se desplegará."
                        return
                    }
                    branch = branch.replaceAll('origin/', '')
                    echo "Rama detectada: ${branch}"

                    switch(branch) {
                        case 'main':
                            env.DEPLOY_ENV = 'production'
                            env.NODE_ENV = 'production'
                            env.DOCKER_TAG = "${env.BUILD_NUMBER}"
                        case 'qa':
                            env.DEPLOY_ENV = 'qa'
                            env.EC2_IP = '3.222.136.111'
                            env.NODE_ENV = 'qa'
                            env.NATS_SERVERS = 'nats://3.230.217.180:4222'
                            break
                        case 'dev':
                            env.DEPLOY_ENV = 'development'
                            env.EC2_IP = '34.196.198.8'
                            env.NODE_ENV = 'development'
                            env.NATS_SERVERS = 'nats://52.200.251.120:4222'
                            break
                        default:
                            env.DEPLOY_ENV = 'none'
                            echo "No hay despliegue configurado para esta rama: ${branch}"
                    }
                }
            }
        }

        stage('Checkout') {
            when {
                expression { env.DEPLOY_ENV != 'none' }
            }
            steps {
                git branch: env.GIT_BRANCH.replaceAll('origin/', ''), url: "${REPO_URL}"
            }
        }

        stage('Build Docker Image - Production') {
            when {
                expression { env.DEPLOY_ENV == 'production' && env.DEPLOY_ENV != 'none' }
            }
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${env.DOCKER_TAG} -t ${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push Docker Image - Production') {
            when {
                expression { env.DEPLOY_ENV == 'production' && env.DEPLOY_ENV != 'none' }
            }
            steps {
                script {
                    sh "docker push ${IMAGE_NAME}:${env.DOCKER_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy to GKE - Production') {
            when {
                expression { env.DEPLOY_ENV == 'production' && env.DEPLOY_ENV != 'none' }
            }
            steps {
                script {
                    def k8sConfigFile = "${K8S_REMOTE_PATH}deployment.yaml"
                    // Acceder a deployment.yaml desde una ubicación relativa o remota
                    sh "kubectl set image ${k8sConfigFile} client-gateway=${IMAGE_NAME}:${env.DOCKER_TAG} --namespace=default"
                    // Verificar que el despliegue se complete exitosamente
                    sh "kubectl rollout status  ${k8sConfigFile} --namespace=default"
                    // def envSuffix = env.DEPLOY_ENV
                    // sh "kubectl apply -f ${k8sConfigFile} --namespace=default"
                }
            }
        }

        stage('Build - Development and QA') {
            when {
                expression { env.DEPLOY_ENV != 'none' && env.DEPLOY_ENV != 'production' }
            }
            steps {
                sh 'rm -rf node_modules'
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Deploy - Development and QA') {
            when {
                expression { env.DEPLOY_ENV != 'none' && env.DEPLOY_ENV != 'production' }
            }
            steps {
                script {
                    def envSuffix = env.DEPLOY_ENV
                    def sshKeyId = env.DEPLOY_ENV == 'development' ? SSH_CRED_ID_DIEGO : SSH_CRED_ID
                    withCredentials([
                        sshUserPrivateKey(credentialsId: sshKeyId, keyFileVariable: 'SSH_KEY'),
                    ]) {
                        sh 'chmod +x ./deploy.sh'    
                        def branchName = env.GIT_BRANCH.replaceAll('origin/', '')
                        sh """
                        SSH_KEY=\$SSH_KEY \
                        EC2_USER=\$EC2_USER \
                        EC2_IP=\$EC2_IP \
                        REMOTE_PATH=\$REMOTE_PATH \
                        REPO_URL=\$REPO_URL \
                        APP_NAME=\$APP_NAME \
                        NODE_ENV=\$NODE_ENV \
                        GIT_BRANCH=${branchName} \
                        NATS_SERVERS=\$NATS_SERVERS \
                        ./deploy.sh
                        """
                    }
                    
                }
            }
        }

        stage('Configure Nginx - Development and QA') {
            when {
                expression { env.DEPLOY_ENV != 'none' && env.DEPLOY_ENV != 'production' }
            }
            steps {
                script {
                    def envSuffix = env.DEPLOY_ENV
                    def sshKeyId = env.DEPLOY_ENV == 'development' ? SSH_CRED_ID_DIEGO : SSH_CRED_ID
                    withCredentials([
                        sshUserPrivateKey(credentialsId: sshKeyId, keyFileVariable: 'SSH_KEY'),
                    ]) {
                        // Copy Nginx config file and the configuration script to the remote server
                        sh "scp -i \$SSH_KEY -o StrictHostKeyChecking=no ./nginx.conf ${EC2_USER}@${EC2_IP}:/tmp/${APP_NAME}.nginx.conf"
                        sh "scp -i \$SSH_KEY -o StrictHostKeyChecking=no ./configure_nginx.sh ${EC2_USER}@${EC2_IP}:/tmp/configure_nginx.sh"

                        // Make the script executable and run it remotely
                        sh """ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} 'chmod +x /tmp/configure_nginx.sh && /tmp/configure_nginx.sh ${APP_NAME}'"""
                    }
                }
            }
        }

        stage('Cleanup Docker - Production') {
            when {
                expression { env.DEPLOY_ENV == 'production' }
            }
            steps {
                sh "docker rmi ${IMAGE_NAME}:${env.DOCKER_TAG} || true"
                sh "docker rmi ${IMAGE_NAME}:latest || true"
                sh "docker system prune -f || true"
            }
        }
    }

    post {
        success {
            echo "Despliegue exitoso en ${env.DEPLOY_ENV}"
        }
        failure {
            echo "El despliegue en ${env.DEPLOY_ENV} ha fallado"
        }
    }
}
