class Logger {
  private readonly tag: string

  constructor(tag: string) {
    this.tag = tag
  }

  public d(message: string) {
    print(message)
  }

  public w(message: string) {
    print(message)
  }

  public e(message: string) {
    print(message)
  }
}
