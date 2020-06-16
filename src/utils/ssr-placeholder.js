const defaultServerRender = () => {
  return null;
};

export default function ssrPlaceholder(webRender, serverRender = defaultServerRender) {
  if (process.env.IS_NODE) {
    return serverRender;
  } else {
    return webRender;
  }
}
