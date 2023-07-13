export type InRootIndex = {
    last: string,
};

export type InDataIndex = {
    date: string,
};

export type InData = {
    articles: {
      id: number,
      titre: string,
      oldPrice: string,
      newPrice: string,
      oldPriceNumeric: number,
      newPriceNumeric: number,
      isInStock: boolean,
      isNew: boolean,
      url: string,
      dateCreation: {
        date: string,
        timezone_type: number,
        timezone: string,
      },
      dateMAJ: any,
      reduction: number,
      boutique: {
        nom: string,
      },
      categorie: {
        nom: string,
      },
      isInStockNumeric: number,
    }[],
};
export type Item = {id: string, name: string, location: string, newPrice: number, oldPrice: number}
export type Data = Item[];

export function mapData(input: InData): Data {
    const data: Data = [];
    for (const article of input.articles) {
        data.push({
        id: `${article.id}`,
        name: article.titre,
        location: article.boutique.nom,
        newPrice: article.newPriceNumeric,
        oldPrice: article.oldPriceNumeric,
        });
    }
    return data;
}
