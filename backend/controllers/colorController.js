const ColorModel = require("../models/colorModel");
const colorRouter = require("../routers/colorRouter");

const colorController = {
    async create(req, res) {
        try {

            if (!req.body.name || !req.body.Hexcode || !req.body.slug) {
                return res.send({ msg: "Please fill all the fields", flag: 0 })
            }

            const findColor = await ColorModel.findOne({ name: req.body.name });
            if (findColor) {
                return res.send({ msg: "Color Already Exists", flag: 0 })
            }


            const color = new ColorModel({
                name: req.body.name,
                Hexcode: req.body.Hexcode,
                slug: req.body.slug
            })
            color.save()
                .then(
                    () => {
                        res.send({ msg: "Color Created Successfully", flag: 1 });

                    }).catch(
                        (err) => {
                            res.send({ msg: "Unable to Create Color", flag: 0, errmsg: err.message });
                        }
                    )

        }
        catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async read(req, res) {
        try {
            const id = req.params.id;
            let colors = null;
            if (id) {
                colors = await ColorModel.findById(id);
            } else {
                colors = await ColorModel.find().sort({ createdAt: -1 });
            }
            res.send({ msg: "Colors found successfully", flag: 1, colors: colors })

        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id;
            const color = await ColorModel.findById(id);
            if (color) {
                await ColorModel.findByIdAndDelete({ _id: id }).then(
                    () => {
                        res.send({ msg: "Color Deleted Successfully", flag: 1 })
                    }
                ).catch(
                    (err) => {
                        res.send({ msg: "Unable to Delete Color", flag: 0, errmsg: err.message });
                    }
                )

            } else {
                return res.send({ msg: "Color  not found", flag: 0 })
            }


        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }
    },
    async statusUpdate(req, res) {
        try {
            const id = req.params.id;
            const color = await ColorModel.findById(id);
            if (color) {
                await ColorModel.updateOne({ _id: id }, { $set: { status: !color.status } }).then(
                    () => {
                        res.send({ msg: "Color Status Updated Successfully", flag: 1 })
                    }
                ).catch(
                    (err) => {
                        res.send({ msg: "Unable to Update Color", flag: 0, errmsg: err.message });
                    }
                )
            } else {
                return res.send({ msg: "Color  not found", flag: 0 })
            }

        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });

        }
    },
    async update(req, res) {
        try {
            const colorId = req.params.id;
            await ColorModel.findByIdAndUpdate(
                {
                    _id: colorId
                },
                {
                    name: req.body.name,
                    slug: req.body.slug,
                    Hexcode: req.body.Hexcode,
                }
            ).then(
                () => {
                    res.send({ msg: "Color Updated Successfully", flag: 1 })
                }
            ).catch(
                (err) => {
                    res.send({ msg: "Unable to update color", flag: 0 })

                }
            )


        } catch (error) {
            res.send({ msg: "Internal Server Error", flag: 0 });
        }

    }


}
module.exports = colorController;
