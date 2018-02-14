/* Declarations for KWin scripts.
 * The documentation based on the "Development/Tutorials/KWin/Scripting/API 4.9"
 * KDE TechBase page licensed under the Creative Commons License SA 4.0:
 * https://techbase.kde.org/Development/Tutorials/KWin/Scripting/API_4.9
 * https://techbase.kde.org/KDE_TechBase:Copyrights
 */

/**
 * Prints all provided values to kDebug and as a D-Bus signal
 * @param values
 */
declare function print(...values): void;

/**
 * Aborts the execution of the script if value does not evaluate to true.
 *
 * If message is provided an error is thrown with the given message, if not provided an error with
 * default message is thrown.
 * @param {boolean} value
 * @param {string} message
 * @returns {boolean}
 */
declare function assert(value: boolean, message ?: string): boolean;
