"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const xlsx = __importStar(require("xlsx"));
function parseExcelToJson(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}
function writeJsonToFile(data, outputFilePath) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(outputFilePath, jsonData);
}
function main() {
    try {
        const excelFilePath = './iw-tech-test-retailer-data.xlsx'; // Update with your file path
        const jsonOutputFilePath = 'output.json'; // Update with desired output file path
        const jsonData = parseExcelToJson(excelFilePath);
        const rectifiedData = [];
        for (let i = 0; i < jsonData.length; i++) {
            rectifiedData.push(jsonData[i]);
            rectifiedData[i].directory_contact_email = jsonData[i].directory_contact_email ? rectifyEmail(jsonData[i].directory_contact_email) : '';
            rectifiedData[i].directory_contact__mobile = jsonData[i].directory_contact__mobile ? rectifyPhoneNumber(jsonData[i].directory_contact__mobile) : '';
            rectifiedData[i].directory_contact__phone = jsonData[i].directory_contact__phone ? rectifyPhoneNumber(jsonData[i].directory_contact__phone) : '';
            rectifiedData[i].directory_contact__website = jsonData[i].directory_contact__website ? rectifyURL(jsonData[i].directory_contact__website) : '';
            rectifiedData[i].content_post_id = jsonData[i].content_post_id ? rectifyNumericId(jsonData[i].content_post_id) : '';
            rectifiedData[i].directory_location__lat = jsonData[i].directory_location__lat ? rectifyLatitude(jsonData[i].directory_location__lat) : '';
            rectifiedData[i].directory_location__lng = jsonData[i].directory_location__lng ? rectifyLongitude(jsonData[i].directory_location__lng) : '';
        }
        writeJsonToFile(rectifiedData, jsonOutputFilePath);
    }
    catch (error) {
        console.error('Error:');
    }
}
function rectifyEmail(email) {
    // Trim whitespace
    email = email.trim();
    // Convert to lowercase (email addresses are case-insensitive)
    email = email.toLowerCase();
    // Remove common typos
    email = email.replace(/[\._%+-]+@[\.%+-]+\.[a-z]{2,}/g, '');
    // Validate using a simple regex (checks for basic structure)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        console.log('Invalid email format');
        return null; // Return null for invalid emails
    }
    return email;
}
function rectifyPhoneNumber(phoneNumber) {
    // Remove non-digit characters
    const cleanedPhoneNumber = phoneNumber.toString().replace(/\D/g, '');
    // Check if the cleaned phone number is valid
    const phoneRegex = /^\d{10,15}$/; // Adjust the regex based on your requirements
    if (!phoneRegex.test(cleanedPhoneNumber)) {
        console.log('Invalid phone number format');
        return null; // Return null for invalid phone numbers
    }
    // Format the phone number (adjust as per your requirements)
    const formattedPhoneNumber = `${cleanedPhoneNumber.slice(0, 2)}${cleanedPhoneNumber.slice(2, 5)}${cleanedPhoneNumber.slice(5, 8)}${cleanedPhoneNumber.slice(8)}`;
    return formattedPhoneNumber;
}
function rectifyURL(url) {
    try {
        // Convert to lowercase (URLs are case-insensitive)
        url = url.toLowerCase();
        // Add missing protocol (assuming HTTP if not provided)
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }
        // Use URL constructor for validation and formatting
        const validatedURL = new URL(url);
        // URL is valid, return the corrected URL
        return validatedURL.href;
    }
    catch (error) {
        console.log('Invalid URL:');
        return null; // Return null for invalid URLs
    }
}
function rectifyNumericId(id) {
    // Remove non-digit characters
    const cleanedId = id.toString().replace(/\D/g, '');
    // Check if the cleaned ID is not empty
    if (!cleanedId) {
        console.log('Invalid numeric ID');
        return null; // Return null for invalid numeric IDs
    }
    // Convert to a number and back to a string to remove leading zeros
    const rectifiedId = String(Number(cleanedId));
    return rectifiedId;
}
function rectifyLatitude(latitude) {
    // Remove non-digit characters and trim whitespace
    const cleanedLatitude = latitude.toString().replace(/[^\d.-]/g, '').trim();
    // Check if the cleaned latitude is not empty
    if (!cleanedLatitude) {
        console.log('Invalid latitude');
        return null; // Return null for invalid latitudes
    }
    // Convert to a number
    const numericLatitude = parseFloat(cleanedLatitude);
    // Check if the latitude is within valid range (-90 to 90)
    if (isNaN(numericLatitude) || numericLatitude < -90 || numericLatitude > 90) {
        console.log('Invalid latitude range');
        return null;
    }
    // Round to a reasonable number of decimal places (adjust as needed)
    const roundedLatitude = numericLatitude.toFixed(6);
    return roundedLatitude;
}
function rectifyLongitude(longitude) {
    // Remove non-digit characters and trim whitespace
    const cleanedLongitude = longitude.toString().replace(/[^\d.-]/g, '').trim();
    // Check if the cleaned longitude is not empty
    if (!cleanedLongitude) {
        console.log('Invalid longitude');
        return null; // Return null for invalid longitudes
    }
    // Convert to a number
    const numericLongitude = parseFloat(cleanedLongitude);
    // Check if the longitude is within valid range (-180 to 180)
    if (isNaN(numericLongitude) || numericLongitude < -180 || numericLongitude > 180) {
        console.log('Invalid longitude range');
        return null;
    }
    // Round to a reasonable number of decimal places (adjust as needed)
    const roundedLongitude = numericLongitude.toFixed(6);
    return roundedLongitude;
}
main();
