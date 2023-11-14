class ViewWatchListMessage {
  constructor(public readonly user_id: number) {}

  toString() {
    return JSON.stringify({
      user_id: this.user_id,
    });
  }
}

export default ViewWatchListMessage;
