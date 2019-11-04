/*eslint-disable */
const shortid = require("shortid");
const path = require("path");
const fs = require("fs");
const Media = require("../models/media.model");

exports.create = async (req, res) => {
  try {
    const file = req.file;
    const { name, type } = req.body;

    console.log("upload", file);

    let fileUrl = "";
    if (file) {
      // handle upload file
      const uploadedFileName =
        shortid.generate() + path.parse(file.originalname).ext;
      fileUrl =
        (process.env.NODE_ENV === "development"
          ? req.protocol + "://" + req.get("host")
          : process.env.BASE_URL) +
        "/public/" +
        uploadedFileName;

      await fs.rename(
        file.path,
        path.join(__dirname, "../../../public", uploadedFileName)
      );
      console.log("fileUrl", fileUrl);
    }

    let media = new Media({
      name,
      type,
      url: fileUrl,
      uploadBy: req.user.id
    });
    const result = await media.save();

    if (result) {
      res.json({
        status: "success",
        message: "Khởi tạo thành công",
        data: result.transform()
      });
    } else {
      res.json({
        status: "failed",
        message: "Khởi tạo không thành công"
      });
    }
  } catch (error) {
    console.log(error);
    res.end(error);
  }
};

exports.update = async (req, res) => {
  try {
    const file = req.file;
    const fields = req.body;

    const mediaId = req.params.id;
    let { name, type } = fields;

    const media = await Media.findById(mediaId);
    if (!media) {
      res.json({
        status: "failed",
        message: "Media không tồn tại"
      });
      return;
    }

    console.log("req.fields", req.body);
    console.log("========================");
    console.log("req.files", req.file);
    console.log("========================");

    // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.
    let fileUrl = null;
    if (file) {
      // handle upload file
      const uploadedFileName =
        shortid.generate() + path.parse(file.originalname).ext;
      fileUrl =
        (process.env.NODE_ENV === "development"
          ? req.protocol + "://" + req.get("host")
          : process.env.BASE_URL) +
        "/public/" +
        uploadedFileName;

      await fs.rename(
        file.path,
        path.join(__dirname, "../../../public", uploadedFileName)
      );
      console.log("pictureUrl", fileUrl);
    }

    media.name = name || media.name;
    media.type = type || media.type;
    media.url = fileUrl || media.url;
    const result = await media.save();

    if (result) {
      res.json({
        status: "success",
        message: "Cập nhật thành công",
        data: result.transform()
      });
    } else {
      res.json({
        status: "failed",
        message: "Cập nhật không thành công"
      });
    }
  } catch (error) {
    console.log("error", error);
    res.json({
      status: "failed",
      message: error.message
    });
  }
};

exports.getMediaDetail = async (req, res) => {
  try {
    const mediaId = req.params.id;

    const media = await Media.getMediaDetail(mediaId);
    if (!media) {
      res.json({
        status: "failed",
        message: "Media không tồn tại"
      });
      return;
    }

    if (media) {
      res.json({
        status: "success",
        data: media.transform()
      });
    } else {
      res.json({
        status: "failed",
        message: "Lỗi không xác định"
      });
    }
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const mediaId = req.params.id;

    const media = await Media.findById(mediaId);
    if (!media) {
      res.json({
        status: "failed",
        message: "CategoryId không tồn tại"
      });
      return;
    }

    const result = await media.delete();

    if (result) {
      res.json({
        status: "success",
        message: "Xoá thành công"
      });
    } else {
      res.json({
        status: "failed",
        message: "Lỗi không xác định"
      });
    }
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message
    });
  }
};
