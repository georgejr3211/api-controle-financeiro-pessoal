export function groupBy(data: any[], key: string, deleteKey?: boolean) {
    return data.map((item) => item[key]).filter((item, i, ar) => ar.indexOf(item) === i).sort((a, b) => a - b).map(item => {
        const items = data.filter(res => res[key] === item)
            .map(res => {
                if (deleteKey) {
                    delete res[key];
                }

                return res;
            });
        return { [key]: item, items };
    });
}

export function sum(arr, key) {
    return arr.reduce((a, b) => a + (b[key] || 0), 0);
}