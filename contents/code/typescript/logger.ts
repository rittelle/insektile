class Logger {
  private readonly tag: string

  constructor(tag: string) {
    this.tag = tag
  }

  public d(message: string) {
    root.d("[D] " + this.tag + ": " + message)
  }

  public w(message: string) {
    root.w("[W]: " + this.tag + ": " + message)
  }

  public e(message: string) {
    root.e("[E]: " + this.tag + ": " + message)
  }
}
