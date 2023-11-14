class GetUsersMessage {
  constructor(public readonly userIds: number[]) {}

  toString() {
    return JSON.stringify({
      userIds: this.userIds,
    });
  }
}

export default GetUsersMessage;
