import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { extname, join } from "path";
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';
import * as puppeteer from 'puppeteer';
import * as htmlDocx from 'html-docx-js';

export const saveImage = (base64?: string, subFolder?: string): string => {
    if (!subFolder) {
        throw { status: 400, message: 'Invalid subFolder' };
    }

    if (base64?.startsWith('data:image')) {
        const matches = base64.match(/^data:(image\/[a-z]+);base64,(.+)$/);
        if (matches) {
            const mimeType = matches[1]; // e.g. "image/png"
            const base64Data = matches[2];
            const extension = mimeType.split('/')[1]; // "png" or "jpeg"
            const fileName = `banner-${uuidv4()}.${extension}`;

            const uploadBase = join(process.cwd(), 'uploads');
            const targetDir = join(uploadBase, subFolder);
            const filePath = join(targetDir, fileName);

            if (!existsSync(targetDir)) {
                mkdirSync(targetDir, { recursive: true });
            }

            const buffer = Buffer.from(base64Data, 'base64');
            writeFileSync(filePath, buffer);

            return `${process.env.BASE_URL}/uploads/${subFolder}/${fileName}`;
        } else {
            throw { status: 400, message: 'Invalid image data (must be base64 and image/*)' };
        }
    } else {
        return base64 || ""
    }
}

export const saveImageFormDate = (image: Express.Multer.File, subFolder?: string) => {
    if (!image) {
        throw { status: 400, message: 'Image file is required' };
    }

    if (!subFolder) {
        throw { status: 400, message: 'Invalid subFolder' };
    }

    const extension = extname(image.originalname);
    const fileName = `banner-${uuidv4()}.${extension}`;

    // Ensure uploads/images exists
    const uploadBase = join(process.cwd(), 'uploads');
    const targetDir = join(uploadBase, subFolder);
    const filePath = join(targetDir, fileName);

    if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
    }

    // Save file manually
    writeFileSync(filePath, image.buffer);

    // Generate link
    const link = `${process.env.BASE_URL}/uploads/${subFolder}/${fileName}`;

    return link;
}

export const generatePdf = (title: string, body: string, subFolder?: string) => {
    if (!subFolder) {
        throw { status: 400, message: 'Invalid subFolder' };
    }

    try {
        const fileName = `pdf-${uuidv4()}.pdf`;
        const uploadBase = join(process.cwd(), 'uploads');
        const targetDir = join(uploadBase, subFolder);
        const filePath = join(targetDir, fileName);

        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        const doc = new PDFDocument();

        doc.pipe(createWriteStream(filePath));
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(body);
        doc.end();

        return `${process.env.BASE_URL}/uploads/${subFolder}/${fileName}`;
    } catch (error: any) {
        throw { status: error?.status || 500, message: error?.message || "Error generatePdf" };
    }
}

export const generatePdfFromHtml = async (html: string, subFolder?: string,): Promise<{ link: string; base64: string }> => {
    if (!subFolder) {
        throw { status: 400, message: 'Invalid subFolder' };
    }

    try {
        const fileName = `pdf-${uuidv4()}.pdf`;
        const uploadBase = join(process.cwd(), 'uploads');
        const targetDir = join(uploadBase, subFolder);
        const filePath = join(targetDir, fileName);

        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Create PDF buffer
        const pdfUint8Array = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Convert Uint8Array to Buffer
        const buffer = Buffer.from(pdfUint8Array);

        // Save PDF to disk
        const writeStream = createWriteStream(filePath);
        writeStream.write(buffer);
        writeStream.end();

        const link = `${process.env.BASE_URL}/uploads/${subFolder}/${fileName}`;

        return {
            link,
            base64: buffer.toString('base64'),
        };
    } catch (error: any) {
        throw { status: error?.status || 500, message: error?.message || "Error generateExcel" };

    }
};

interface ExcelOptions {
    title: string;
    body: string[][]; // Array of rows, each row is array of cells
    subFolder?: string;
    header?: string[];
    columnWidths?: number[];
    headerBgColor?: string; // hex color, e.g., 'FF2E86C1'
    headerFontColor?: string; // hex color, e.g., 'FFFFFFFF'
}

export const generateExcel = async (options: ExcelOptions): Promise<{ link: string; base64: string }> => {
    const { title, body, subFolder, header, columnWidths, headerBgColor = 'FF2E86C1', headerFontColor = 'FFFFFFFF' } = options;

    if (!subFolder) {
        throw { status: 400, message: 'Invalid subFolder' };
    }

    try {
        const fileName = `excel-${uuidv4()}.xlsx`;
        const uploadBase = join(process.cwd(), 'uploads');
        const targetDir = join(uploadBase, subFolder);
        const filePath = join(targetDir, fileName);

        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet 1');

        // Add title row
        const titleRow = sheet.addRow([title]);
        titleRow.font = { size: 16, bold: true };
        sheet.addRow([]);

        // Add header row if provided
        if (header) {
            const headerRow = sheet.addRow(header);
            headerRow.eachCell(cell => {
                cell.font = { bold: true, color: { argb: headerFontColor } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: headerBgColor },
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            // Apply column widths if provided
            if (columnWidths) {
                columnWidths.forEach((width, index) => {
                    sheet.getColumn(index + 1).width = width;
                });
            }
        }

        // Add body rows
        body.forEach(rowData => {
            const row = sheet.addRow(rowData);
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        // Save Excel file to disk
        await workbook.xlsx.writeFile(filePath);

        // Generate base64
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        const link = `${process.env.BASE_URL}/uploads/${subFolder}/${fileName}`;

        return { link, base64 };
    } catch (error: any) {
        throw { status: error?.status || 500, message: error?.message || "Error generateExcel" };
    }
}

export const lowercaseFirstLetter = (str: string): string => {
    if (typeof str !== 'string' || str.length === 0) {
        return str; // Return as is for non-strings or empty strings
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export const capitalizeFirstLetter = (str: string) => {
    if (typeof str !== 'string' || str.length === 0) {
        return str; // Return as is if not a string or empty
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const generateWordFromHtml = async (
    html: string,
    subFolder?: string
): Promise<{ link: string; base64: string }> => {
    if (!subFolder) {
        throw { status: 400, message: 'Invalid subFolder' };
    }

    try {
        const fileName = `word-${uuidv4()}.docx`;
        const uploadBase = join(process.cwd(), 'uploads');
        const targetDir = join(uploadBase, subFolder);
        const filePath = join(targetDir, fileName);

        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        // Generate docx
        const result = htmlDocx.asBlob(html);

        let docBuffer: Buffer;

        if (result instanceof Buffer) {
            // Already a Node.js Buffer
            docBuffer = result;
        } else {
            // Force TS to treat as Blob here
            const blob = result as unknown as Blob;
            const arrayBuffer = await blob.arrayBuffer();
            docBuffer = Buffer.from(arrayBuffer);
        }

        // Save to disk
        writeFileSync(filePath, docBuffer);

        // Convert to Base64
        const base64 = docBuffer.toString('base64');
        const link = `${process.env.BASE_URL}/uploads/${subFolder}/${fileName}`;

        return { link, base64 };
    } catch (error: any) {
        throw { status: error?.status || 500, message: error?.message || "Error generatePdf" };
    }
};