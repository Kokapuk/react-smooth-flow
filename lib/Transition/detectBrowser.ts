const detectBrowser = () => {
  if (navigator.userAgent.includes('Chrome')) {
    return 'chromium';
  } else if (navigator.userAgent.includes('Firefox')) {
    return 'firefox';
  } else if (navigator.userAgent.includes('Safari') || navigator.userAgent.includes('AppleWebKit')) {
    return 'webkit';
  } else {
    throw Error('Failed to detect browser');
  }
};

export default detectBrowser;
