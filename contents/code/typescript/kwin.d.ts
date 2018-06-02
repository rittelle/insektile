/* Declarations for KWin scripts.
 * The documentation based on the "Development/Tutorials/KWin/Scripting/API 4.9"
 * KDE TechBase page licensed under the Creative Commons License SA 4.0:
 * https://techbase.kde.org/Development/Tutorials/KWin/Scripting/API_4.9
 * https://techbase.kde.org/KDE_TechBase:Copyrights
 */

/** Global property to all configuration values of KWin core. */
declare const options: KWinOptions

/** Global property to the core wrapper of KWin. */
declare const workspace: KWinWorkspaceWrapper

/** Provides access to enums defined in KWin::WorkspaceWrapper. */
declare namespace KWin {
  // TODO
  /** window movement snapping area? ignore struts. */
  let PlacementArea
  let MovementArea
  let MaximizeArea
  let MaximizeFullArea
  let FullScreenArea
  let WorkArea
  let FullArea
  let ScreenArea

  /**
   * Registers the given sequece as a global shortcut.
   *
   * @param title The title displayed in the shortcut settings.
   * @param text ???
   * @param keySequence E.g. "meta+a".
   * @param callback This gets called if the shortcut is triggered.
   * @returns True on success, false if the callback is not callable.
   */
  function registerShortcut(title: string, text: string, keySequence: string, callback: any /* TODO */): boolean
}

/**
 * Prints all provided values to kDebug and as a (D-Bus signal
 * @param values
 */
declare function print(...values): void

/**
 * Aborts the execution of the script if value does not evaluate to true.
 *
 * If message is provided an error is thrown with the given message, if not provided an error with
 * default message is thrown.
 * @param {boolean} value
 * @param {string} message
 * @returns {boolean}
 */
declare function assert(value: boolean, message?: string): boolean

/** Inherits: KDecorationOptions */
declare class KWinOptions {
  // TODO
}

/** */
declare class KWinWorkspaceWrapper {
  // TODO
  //ClientAreaOption

  /** Window movement snapping area? ignore struts. */
  /*
  PlacementArea
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
  public currentActivity: string

  /** */
  public activities: string[]

  // Read-write Properties
  /** */
  public currentDesktop: number

  /** The number of desktops currently used. Minimum number of desktops is 1, maximum 20.
   *
   * The first desktop has number 1.
   */
  public desktops: number

  // Functions
  /** List of Clients currently managed by KWin. */
  public clientList(): KWinClient[]
  /** Returns the name for the given desktop.
   * @param {number} desktop Desktop ID, 1..20
   */
  public desktopName(desktop: number): string

  /** Returns the area a client can use.
   *
   * @param option A ClientArea option for a specific usecase. This being a
   *                number is a workaround for KWin not exporting this to QML.
   * @param screen A screen number
   * @param desktop A desktop index
   */
  public clientArea(option: number, screen: number, desktop: number): QRect

  // Signals
  /**
   * Emitted when the current desktop is changed.
   *
   * Parameters:
   * - desktop: number of the last desktop
   * - client: KWinClient ???
   */
  public currentDesktopChanged: QtSignal
}

declare class KWinTopLevel {
  public activities: string[]
  public desktop: number
  public managed: boolean
  //rect: QRect
  public x: number
  public y: number
  public width: number
  public height: number
}

declare class KWinClient extends KWinTopLevel {
  // TODO
  public caption: string
  public geometry: QRect
}
