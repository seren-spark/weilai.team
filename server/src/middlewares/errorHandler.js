export const errorHandler = (err, req, res, next) => {
  console.error("❌ 未处理的错误:", err);
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development" ? err.message : "服务器内部错误",
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: "接口不存在",
  });
};
