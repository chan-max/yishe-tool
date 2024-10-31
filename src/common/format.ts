




function formatCurrency(amount, currency = 'CNY') {
    const options = {
        currency: currency,
        minimumFractionDigits: 2, // 最小小数位数
        maximumFractionDigits: 2  // 最大小数位数
    };

    return new Intl.NumberFormat('zh-CN', options).format(amount);
}


export class Format {
    formatCurrency = formatCurrency
}