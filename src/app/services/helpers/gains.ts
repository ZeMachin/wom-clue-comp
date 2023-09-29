export const getGainsTotal = (gains: any, metrics: {name: string, weight: number}[]): number => {
    let total = 0;
    for (const metric of metrics) 
      total += gains[metric.name] * metric.weight;
    return total;
}