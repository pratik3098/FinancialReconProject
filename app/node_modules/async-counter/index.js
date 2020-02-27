function asyncCounter(max, {
  onFinished = max => {},
  onCount = ({payload, max, current}) => {}
} = {}) {
  let count;
  const counter = new Promise(resolve => {
    let current = 0;
    count = payload => {
      if (++current >= max) {
        resolve(max);
      }

      onCount({payload, current, max});
      return current;
    };
  });
  counter.count = count;
  counter.then(onFinished);
  return counter;
}

module.exports = Object.assign(asyncCounter, {
  asyncCounter,
  default: asyncCounter
});
