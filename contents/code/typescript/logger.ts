class Logger {
  private readonly tag: string

  constructor(tag: string) {
    this.tag = tag
  }

  public d(message: string) {
    print("[D]: " + message)
  }

  public w(message: string) {
    print("[W]: " + message)
  }

  public e(message: string) {
    print("[E]: " + message)
  }
}
