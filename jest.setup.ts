global.chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn(),
      getRules: jest.fn(),
      hasListener: jest.fn(),
      removeRules: jest.fn(),
      addRules: jest.fn(),
      removeListener: jest.fn(),
      hasListeners: jest.fn(),
    },
    onMessage: {
      addListener: jest.fn(),
    },
    OnInstalledReason: {
      INSTALL: "install",
      UPDATE: "update",
    },
  },
  contextMenus: {
    onClicked: {
      addListener: jest.fn(),
    },
    create: jest.fn(),
  },
  storage: {
    local: {
      set: jest.fn(),
      get: jest.fn(),
    },
  },
  tabs: {
    sendMessage: jest.fn(),
  },
} as any
