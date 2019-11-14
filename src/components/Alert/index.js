import Alert from './alert';

let alertInstance = null;
const getAlertInstance = tip => {
  alertInstance =
    alertInstance ||
    Alert.newInstance({
      tip
    });
  return alertInstance;
};

export default {
  open(tip = '请自定义错误信息', timeout = 2000) {
    getAlertInstance(tip);
    setTimeout(() => {
      this.close();
    }, timeout);
  },
  close() {
    if (alertInstance) {
      alertInstance.destroy();
      alertInstance = null;
    }
  }
};
