export interface ISocial {
    vk?: string;
    ok?: string;
    instagram?: string;
    facebook?: string;
}

export interface ICompanyDetails {
    businessAreas: string[]; // Сферы деятельности
    inn: string;
    ogrn: string;
    registrationDate: Date;
    phone: string;
    website: string;
    email: string;
    social?: ISocial;
    //certificateOfRegistration?: string;
    registeredAddress?: string; // Юридический адрес
    postAddress?: string; // Почтовый адрес
    shortTitle: string; // Короткое наименование
    longTitle: string; // Полное наименование
    ceo: string; // Генеральный директор
}

export interface IBankAccountDetails {
    kpp: string;
    bank?: string;
    paymentAccount?: string; // Расчетный счет
    correspondingAccount?: string; // Корреспондентский счет
    bik?: string;
    okpo?: string;
}
