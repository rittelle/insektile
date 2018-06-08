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
  /*
  let PlacementArea
  let MovementArea
  let MaximizeArea
  let MaximizeFullArea
  let FullScreenArea
  let WorkArea
  let FullArea
  let ScreenArea
  */

  /**
   * Registers the given sequece as a global shortcut.
   *
   * @param title The object name of the resulting QAction which is also used as the identifier in the settings.
   * @param text The title displayed in the shortcut settings.
   * @param keySequence E.g. "meta+a".
   * @param callback This gets called if the shortcut is triggered.
   * @returns True on success, at the time of writing this only returns false if the callback is not callable.
   */
  function registerShortcut(title: string, text: string, keySequence: string, callback: any /* TODO */): boolean
}

/**
 * Prints all provided values to kDebug and as a (D-Bus signal
 * @param values
 */
declare function print(...values: any[]): void

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

  /** Index of the currently active screen. */
  public activeScreen: number

  /** Total number of connected screens. */
  public numScreens: number

  // Read-write Properties
  /** */
  public currentDesktop: number

  /** The number of desktops currently used. Minimum number of desktops is 1, maximum 20.
   *
   * The first desktop has number 1.
   */
  public desktops: number

  /** The active client. */
  public activeClient: KWinClient

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

  /**
   * Emitted when the window focus changes.
   *
   * Parameters:
   * - client: KWinClient ???
   */
  public clientActivated: QtSignal

  /**
   * Emitted when a new window is shown.
   *
   * Parameters:
   * - client: KWinClient The new client.
   */
  public clientAdded: QtSignal

  /**
   * Emitted when a new window is closed.
   *
   * Parameters:
   * - client: KWinClient The closed client.
   */
  public clientRemoved: QtSignal

  /**
   * Emitted when a client is minimized.
   * 
   * Parameters:
   * - client: KWinClient The changed client.
   */
  public clientMinimized: QtSignal

  /**
   * Emitted when a client is no longer minimized.
   * 
   * Parameters:
   * - client: KWinClient The changed client.
   */
  public clientUnminimized: QtSignal

  /**
   * Emmitted when the maximized status of a client is changed.
   * 
   * Parameters:
   * - client: KWinClient The changed client.
   * - h: boolean True if the client is horizontally maximized.
   * - v: boolean True if the client is vertically maximized.
   */
  public clientMaximizeSet: QtSignal

  /**
   * Emitted when a screen is resized.
   *
   * Parameters:
   * - screen: number The changed screen.
   */
  public screenResized: QtSignal
}

declare class KWinTopLevel {
  // Read-only properties
  public activities: string[]
  public desktop: number
  public screen: number
  public managed: boolean
  public windowId: number
  public windowType: number
  //rect: QRect
  public x: number
  public y: number
  public width: number
  public height: number
}

declare class KWinClient extends KWinTopLevel {
  // Read-only properties
  public caption: string
  /** Returns true if the window is of a type that is not managed by the user (e.g. docks, backgrounds, ...) */
  public specialWindow: boolean
  /** */
  public resourceClass: string // TODO: Not a string (fixed with +"" for now ;))

  // Read-write properties
  /** Window geometry including border. */
  public geometry: QRect
  /** True if the client is minimized. */
  public minimized: boolean
}
