export const getCreators = (nfts) => {
    const creators = nfts.reduce((creatorObject, nft) => {
        (creatorObject[nft.seller] = creatorObject[nft.seller] || []).push(nft);

        return creatorObject;
    }, {});

    return Object.entries(creators).map((creator) => {
        const seller = creator[0];
        const sum = creator[1].map((item) => Number(item.price)).reduce((prev, current) => prev + current, 0);

        return ({ seller, sum })
    })
};