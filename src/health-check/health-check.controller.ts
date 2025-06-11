import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("/")
export class HealthCheckController {
    @Get()
    @HttpCode(200)
    healthCheck(): string {
        return "Client Gateway is running :D!";
    }
}