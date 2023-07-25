import Channel = require("./channel");

export type Listener = Channel | ((...args: any[]) => any);
