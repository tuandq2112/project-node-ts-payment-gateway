import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class ProductCheckoutDTO {
    public name: string;
    public description: string;

    @IsEmail()
    public email: string;

    @IsNotEmpty()
    public currencyType: string;

    @IsNotEmpty()
    public currency: string;

    @IsNotEmpty()
    public amount: Number;

    @IsNotEmpty()
    public metadataOrderId: string;
    
    @IsNotEmpty()
    public metadataOrderKey: string;

    @IsNotEmpty()
    public metadataSource: string;

    @IsUrl()
    public logoUrl: string;
    
    // các hook khác:
}
