
export function calculateCRC16(payload: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
        }
    }
    return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
}

export function generatePix({
    key,
    name,
    city,
    transactionId = '***',
    value
}: {
    key: string;
    name: string;
    city: string;
    transactionId?: string;
    value: number;
}): string {
    const formatField = (id: string, value: string) => {
        const len = value.length.toString().padStart(2, '0');
        return `${id}${len}${value}`;
    };

    const cleanText = (text: string, maxLength: number) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, '').substring(0, maxLength);
    }

    const merchantAccountInfo = formatField('00', 'br.gov.bcb.pix') + formatField('01', key);
    const amountStr = value.toFixed(2).toString();
    const cleanMerchantName = cleanText(name, 25);
    const cleanMerchantCity = cleanText(city, 15);

    let payload = '000201';
    payload += formatField('26', merchantAccountInfo);
    payload += '52040000'; // Merchant Category Code
    payload += '5303986'; // Transaction Currency (BRL)
    payload += formatField('54', amountStr); // Transaction Amount
    payload += '5802BR'; // Country Code
    payload += formatField('59', cleanMerchantName); // Merchant Name
    payload += formatField('60', cleanMerchantCity); // Merchant City
    payload += formatField('62', formatField('05', transactionId)); // Additional Data Field
    payload += '6304'; // CRC16 ID and length

    const crc = calculateCRC16(payload);
    return payload + crc;
}
