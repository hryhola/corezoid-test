import { describe, it } from './test-framework'
import { regexRegistry, getPatterStringGenerator } from './regex-registry'

describe("regexRegistry", () => {
    it("should have a valid regex for COREZOID_PUBLIC_API", () => {
        const corezoidApiRegex = regexRegistry.COREZOID_PUBLIC_API.regex;
        
        const validUrl = "https://subdomain.corezoid.com/api/1/json/public/123/abc123/";
        const invalidUrl = "https://invalid.url/api/1/json/public/123/abc123/";

        if (!corezoidApiRegex.test(validUrl)) {
            throw new Error(`Valid URL should match the regex, but it did not: ${validUrl}`);
        }
    
        if (corezoidApiRegex.test(invalidUrl)) {
            throw new Error(`Invalid URL should not match the regex, but it did: ${invalidUrl}`);
        }
    });

    it("should generate a valid URL using stringsGenerator", () => {
        const generatedUrl = regexRegistry.COREZOID_PUBLIC_API.stringsGenerator();

        // Check if generated URL matches the regex
        if (!regexRegistry.COREZOID_PUBLIC_API.regex.test(generatedUrl)) {
            throw new Error(`Generated URL is invalid: ${generatedUrl}`);
        }
    });
});

describe("getPatterStringGenerator", () => {
    it("should return the correct string generator for known regex", () => {
        const regex = regexRegistry.COREZOID_PUBLIC_API.regex;
        const generator = getPatterStringGenerator(regex);
        
        if (typeof generator !== 'function') {
            throw new Error("The generator should be a function.");
        }

        const generatedString = generator();
        
        // Verify that the generated string matches the regex
        if (!regex.test(generatedString)) {
            throw new Error(`Generated string does not match regex: ${generatedString}`);
        }
    });

    it("should throw an error for unknown regex patterns", () => {
        const unknownRegex = /unknown_regex_pattern/;

        try {
            getPatterStringGenerator(unknownRegex);
            throw new Error("Expected an error to be thrown for unknown regex patterns, but none was.");
        } catch (error) {
            if (!error.message.includes('Unknown string pattern received!')) {
                throw new Error(`Expected specific error message, got: ${error.message}`);
            }
        }
    });
});
