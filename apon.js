/*
 * APON.js - A JavaScript library for APON (Aspectran Parameters Object Notation)
 *
 * Copyright (c) 2024-present The Aspectran Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(global) {
    'use strict';

    const APON = {};

    const COMMENT_LINE_START = '#';
    const NAME_VALUE_SEPARATOR = ':';
    const CURLY_BRACKET_OPEN = '{';
    const CURLY_BRACKET_CLOSE = '}';
    const SQUARE_BRACKET_OPEN = '[';
    const SQUARE_BRACKET_CLOSE = ']';
    const ROUND_BRACKET_OPEN = '(';
    const ROUND_BRACKET_CLOSE = ')';
    const TEXT_LINE_START = '|';
    const DOUBLE_QUOTE_CHAR = '"';
    const SINGLE_QUOTE_CHAR = "'";
    const ESCAPE_CHAR = '\\';

    /**
     * Parses an APON (Aspectran Parameters Object Notation) string, constructing the JavaScript value or object described by the string.
     * @param {string} text The string to parse as APON.
     * @returns {object} The object corresponding to the given APON text.
     */
    APON.parse = function(text) {
        if (typeof text !== 'string' || !text.trim()) {
            return {};
        }

        const lines = text.split(/\r?\n/);
        let i = 0;

        function parseValue(value) {
            value = value.trim();
            if (value === 'null') return null;
            if (value === 'true') return true;
            if (value === 'false') return false;

            if ((value.startsWith(DOUBLE_QUOTE_CHAR) && value.endsWith(DOUBLE_QUOTE_CHAR)) ||
                (value.startsWith(SINGLE_QUOTE_CHAR) && value.endsWith(SINGLE_QUOTE_CHAR))) {
                return unescapeString(value.substring(1, value.length - 1));
            }

            if (!isNaN(value) && value.trim() !== '') {
                if (value.includes('.')) {
                    return parseFloat(value);
                } else {
                    return parseInt(value, 10);
                }
            }
            return value;
        }
        
        function unescapeString(str) {
            // A simple unescape for common sequences. A full implementation would be more complex.
            return str.replace(/\"/g, '"').replace(/\'/, "'").replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
        }

        function parseObject(endChar) {
            const obj = endChar === SQUARE_BRACKET_CLOSE ? [] : {};

            while (i < lines.length) {
                let line = lines[i].trim();
                i++;

                if (!line || line.startsWith(COMMENT_LINE_START)) {
                    continue;
                }

                if (line === endChar) {
                    return obj;
                }

                if (Array.isArray(obj)) {
                    if (line === CURLY_BRACKET_OPEN) {
                        obj.push(parseObject(CURLY_BRACKET_CLOSE));
                    } else {
                        obj.push(parseValue(line));
                    }
                    continue;
                }

                const separatorIndex = line.indexOf(NAME_VALUE_SEPARATOR);
                if (separatorIndex === -1) {
                    throw new Error('Invalid APON format: Missing name-value separator ":" at line ' + i);
                }

                let name = line.substring(0, separatorIndex).trim();
                let value = line.substring(separatorIndex + 1).trim();
                
                // Strip type hints for simplicity in this parser version
                const typeHintIndex = name.indexOf(ROUND_BRACKET_OPEN);
                if (typeHintIndex > 0 && name.endsWith(ROUND_BRACKET_CLOSE)) {
                    name = name.substring(0, typeHintIndex);
                }

                if (value === CURLY_BRACKET_OPEN) {
                    obj[name] = parseObject(CURLY_BRACKET_CLOSE);
                } else if (value === SQUARE_BRACKET_OPEN) {
                    obj[name] = parseObject(SQUARE_BRACKET_CLOSE);
                } else if (value.startsWith(ROUND_BRACKET_OPEN)) { // text block
                    let text = '';
                    let firstLine = true;
                    while (i < lines.length) {
                        let textLine = lines[i];
                        const trimmedTextLine = textLine.trim();
                        if (trimmedTextLine === ROUND_BRACKET_CLOSE) {
                            i++;
                            break;
                        }
                        if (trimmedTextLine.startsWith(TEXT_LINE_START)) {
                            if (!firstLine) {
                                text += '\n';
                            }
                            text += textLine.substring(textLine.indexOf(TEXT_LINE_START) + 1);
                            firstLine = false;
                        }
                        i++;
                    }
                    obj[name] = text;
                } else {
                    obj[name] = parseValue(value);
                }
            }
            return obj;
        }

        return parseObject(null); // Top-level is an object without a closing char
    };

    /**
     * Converts a JavaScript value to an APON (Aspectran Parameters Object Notation) string.
     * @param {object} obj The value to convert to an APON string.
     * @param {object|number} [options] An object that contains options, or the number of spaces to use for indentation.
     * @param {string} [options.indent="  "] The string to use for indentation.
     * @returns {string} The APON string representation of the value.
     */
    APON.stringify = function(obj, options) {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            throw new Error('APON.stringify input must be a non-array object.');
        }

        let indentString = '  ';
        if (typeof options === 'number') {
            indentString = ' '.repeat(options);
        } else if (typeof options === 'object' && options !== null && typeof options.indent === 'string') {
            indentString = options.indent;
        }

        function needsQuotes(str) {
            return /[:#\s"']/.test(str) || /^[\]/.test(str) || /[\s]$/.test(str) || str.length === 0;
        }

        function escapeString(str) {
            return str.replace(/\\/g, '\\\\').replace(/"/g, '\"').replace(/\n/g, '\\n');
        }

        function stringifyValue(value, indent) {
            if (value === null) return 'null';
            if (typeof value === 'string') {
                if (value.includes('\n')) { // Multi-line text
                    const lines = value.split('\n');
                    let result = '(\n';
                    for (const line of lines) {
                        result += indent + indentString + TEXT_LINE_START + line + '\n';
                    }
                    result += indent + ')';
                    return result;
                } else {
                    return needsQuotes(value) ? `"${escapeString(value)}"` : value;
                }
            }
            if (typeof value === 'object') {
                return stringifyObject(value, indent);
            }
            return String(value);
        }

        function stringifyObject(obj, indent) {
            const newIndent = indent + indentString;
            let str = '';

            if (Array.isArray(obj)) {
                str += '[';
                if (obj.length > 0) {
                    str += '\n';
                    for (const item of obj) {
                        str += newIndent + stringifyValue(item, newIndent) + '\n';
                    }
                    str += indent;
                }
                str += ']';
            } else {
                str += '{';
                const keys = Object.keys(obj);
                if (keys.length > 0) {
                    str += '\n';
                    for (const key of keys) {
                        const value = obj[key];
                        if (value !== undefined) {
                            str += newIndent + key + ': ' + stringifyValue(value, newIndent) + '\n';
                        }
                    }
                    str += indent;
                }
                str += '}';
            }
            return str;
        }

        const keys = Object.keys(obj);
        const lines = [];
        for (const key of keys) {
            const value = obj[key];
            if (value !== undefined) {
                lines.push(`${key}: ${stringifyValue(value, '')}`);
            }
        }
        return lines.join('\n');
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = APON;
    } else {
        global.APON = APON;
    }

})(typeof window !== 'undefined' ? window : this);
