/* Declarations for KWin scripts.
 * The documentation based on the "Development/Tutorials/KWin/Scripting/API 4.9"
 * KDE TechBase page licensed under the Creative Commons License SA 4.0:
 * https://techbase.kde.org/Development/Tutorials/KWin/Scripting/API_4.9
 * https://techbase.kde.org/KDE_TechBase:Copyrights
 */

/** Global property to all configuration values of KWin core. */
declare const options: KWinOptions;

/** Global property to the core wrapper of KWin. */
declare const workspace: KWinWorkspaceWrapper;

/** Provides access to enums defined in KWin::WorkspaceWrapper. */
declare namespace KWin {
    // TODO
    /** window movement snapping area? ignore struts. */
    let PlacementArea;
    let MovementArea;
    let MaximizeArea;
    let MaximizeFullArea;
    let FullScreenArea;
    let WorkArea;
    let FullArea;
    let ScreenArea;
}

/**
 * Prints all provided values to kDebug and as a (D-Bus signal
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
declare function assert(value: boolean, message?: string): boolean;

/** Inherits: KDecorationOptions */
declare class KWinOptions {
    // TODO
}

/** */
declare class KWinWorkspaceWrapper {
    // TODO
    //ClientAreaOption

    /** Window movement snapping area? ignore struts. */
    PlacementArea;
    /*
    MovementArea:
    MaximizeArea:
    MaximizeFullArea:
    FullScreenArea:
    WorkArea:
    FullArea:
    ScreenArea:
    */

    // Read-only Properties
    /** */
    currentActivity: String;

    /** */
    activities: Array<string>;

    // Read-write Properties
    /** */
    currentDesktop: number

    /** The number of desktops currently used. Minimum number of desktops is 1, maximum 20.
     *
     * The first desktop has number 1.
     */
    desktops: number

    // Functions
    /** List of Clients currently managed by KWin. */
    clientList(): Array<KWinClient>
    /** Returns the name for the given desktop.
     * @param {number} desktop Desktop ID, 1..20
     */
    desktopName(desktop: number): string
}

declare class KWinTopLevel {
    activities: string[]
    desktop: number
    managed: boolean
}

declare class KWinClient extends KWinTopLevel {
    // TODO
    caption: string
}
