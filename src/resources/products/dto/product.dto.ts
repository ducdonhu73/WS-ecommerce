import { IsNotEmpty } from "class-validator";



export class AllProductRequest{

}

export class AddProductRequest{
    
    @IsNotEmpty()
    category_id: string;
  
    @IsNotEmpty()
    product_name: string;
  
    @IsNotEmpty()
    amount: string;
  
    @IsNotEmpty()
    price: number;
    
    description: Text;

    image: String;
    

}

export class AddProductResponse{

    @IsNotEmpty()
    success : boolean

    constructor(success : boolean){
        this.success = success;
    }

}







