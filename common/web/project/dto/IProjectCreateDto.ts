export interface IProjectCreateDto {
    name: string;
    location: string;
    imageData?: string;
    description: string;
    shortDescription: string;

    amount: number;
}
