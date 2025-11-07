export const weatherTool = {
  type: "function",
  function: {
    name: "get_current_weather",
    description: "当你想查询指定城市的天气时非常有用。",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "城市或县区，比如北京市、杭州市、余杭区等。",
        },
      },
      required: ["location"],
    },
  },
};

export const getCurrentWeather = async (args) => {
  const weatherConditions = ["晴天", "多云", "雨天", "阴天", "雾霾", "小雨"];
  const randomWeather =
    weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const temperature = Math.floor(Math.random() * 20) + 10; // 10-30度
  const location = args.location;

  return `${location}今天是${randomWeather}，温度${temperature}°C。`;
};
