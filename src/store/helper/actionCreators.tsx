export const getImage = (image: string): () => Promise<string> => async () => {
    let res: string = "";
    await fetch(process.env.REACT_APP_GOOGLE_STORAGE_KEY + "books/" + image)
        .then(async (response) => {
            if (!response.ok) {
                throw Error("Could not fetch image");
            }
            const blob = await response.blob()
            res = URL.createObjectURL(blob);
            return res;
        })
        .catch(err => {
            return err.message;
        })
    return res;
}

export const compareObjectKeys = (obj1: Object, obj2: Object): boolean => {
    const obj1Keys = Object.keys(obj1).sort();
    const obj2Keys = Object.keys(obj2).sort();
    return JSON.stringify(obj1Keys) === JSON.stringify(obj2Keys);
}

export const renewAccessToken = async (): Promise<boolean> => {
    let res: boolean = false;
    await fetch(process.env.REACT_APP_API_KEY + "auth/renew_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    }).then(response => {
        if (!response.ok) {
            throw Error("Could not renew token");
        }
        return response.json();
    }).then(data => {
        res = data;
    }).catch(err => {
        return err.message;
    })
    return res;
}

export const handleRequestWithTokenRenewal = async (requestOptions: any): Promise<any> => {
    let response: any;

    const renewed: boolean = await renewAccessToken();
    if (!renewed) {
        // TODO logout
        throw new Error("Failed to renew token");
    }

    response = await fetch(requestOptions.url, requestOptions);
    if (!response.ok) {
        throw Error("Not ok");
    }

    return response.json();
};
