const statisticName = [`All time`, `Today`, `Week`, `Month`, `Year`];

const genStatistic = () => {
  return statisticName.map((it) => {
    return {
      name: it,
    };
  });
};

export {genStatistic};

