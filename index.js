import express, { json } from "express";
import cors from "cors";
import mysql from "mysql";

const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "chung",
    database: "quanlydatsan",
});

app.get("/", (req, res) => {
    res.json("Xin chào, đây là server quanlysanbong");
});

app.listen(8800, () => {
    console.log("Connected to server!!!");
});

app.get("/accounts", (req, res) => {
    const query = "select * from taikhoan";
    db.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/football-pitch/:id", (req, res) => {
    const query =
        "SELECT id_sanbong, tensanbong, id_xaphuong, id_trangthai_sanbong, id_taikhoan, thoigiandong, thoigianmo, hinhanh, gioithieu, diachicuthe , (select json_arrayagg(json_object('id_san', id_san, 'tensan', tensan))   from san where san.id_sanbong = sanbong.id_sanbong group by sanbong.id_sanbong) as 'danhsachsancon' FROM sanbong where id_sanbong = ?";

    const id = req.params.id;
    var dataFootballPitches = {};
    dataFootballPitches.status = "200";
    dataFootballPitches.data = {};

    db.query(query, [id], (err, data) => {
        if (err) return res.json(err);
        Object.values(data).forEach((item) => {
            dataFootballPitches.data.id_sanbong = item.id_sanbong;
            dataFootballPitches.data.tensanbong = item.tensanbong;
            dataFootballPitches.data.id_xaphuong = item.id_xaphuong;
            dataFootballPitches.data.id_trangthai_sanbong =
                item.id_trangthai_sanbong;
            dataFootballPitches.data.thoigianmo = item.thoigianmo;
            dataFootballPitches.data.thoigiandong = item.thoigiandong;
            dataFootballPitches.data.hinhanh = item.hinhanh;
            dataFootballPitches.data.gioithieu = item.gioithieu;
            dataFootballPitches.data.diachicuthe = item.diachicuthe;
            dataFootballPitches.data.danhsachsancon = JSON.parse(
                item.danhsachsancon
            );
        });
        return res.json(dataFootballPitches);
    });
});

app.get("pitches", (req, res) => {
    const query = "";
    db.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/football-pitches", (req, res) => {
    const query = "SELECT * FROM sanbong where id_trangthai_sanbong = 1;";

    db.query(query, (err, data) => {
        if (err) return res.json(err);

        return res.json(data);
    });
});

app.get("/getPrice", (req, res) => {
    const query =
        "select * from san, loaisan, loaisankhunggio, khunggio where san.id_loaisan = loaisan.id_loaisan and loaisan.id_loaisan = loaisankhunggio.id_loaisan and loaisankhunggio.id_khunggio = khunggio.id_khunggio and san.id_san = ? and khunggio.id_khunggio=? ";
    const idPitch = req.query.idPitch;
    const idInterval = req.query.idInterval;
    db.query(query, [idPitch, idInterval], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/pitch/:id", (req, res) => {
    const query =
        "SELECT san.id_san,tensan,id_trangthai_san,hinhanh,mota, tenloaisan, thoigianbatdau, thoigianketthuc, trangthai_sankhunggio, giatien, trangthai_sankhunggio.id_trangthai_sankhunggio , khunggio.id_khunggio FROM san, loaisan, sankhunggio, khunggio, trangthai_sankhunggio, loaisankhunggio where san.id_loaisan = loaisan.id_loaisan and san.id_san = sankhunggio.id_san and        khunggio.id_khunggio = sankhunggio.id_khunggio and trangthai_sankhunggio.id_trangthai_sankhunggio = sankhunggio.id_trangthai_sankhunggio and loaisankhunggio.id_khunggio = khunggio.id_khunggio and loaisankhunggio.id_loaisan = loaisan.id_loaisan and san.id_san = ? order by san.id_san";
    const idPitch = req.params.id;
    db.query(query, [idPitch], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/getUser", (req, res) => {
    const q = "SELECT * FROM taikhoan where tentaikhoan = ? and matkhau = ?;";
    const username = req.query.username;
    const password = req.query.password;
    db.query(q, [username, password], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/getProvince", (req, res) => {
    const q = "SELECT * FROM tinhthanh";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/getDistrict", (req, res) => {
    const query = "SELECT * FROM quanhuyen where id_tinhthanh = ?";
    const idProvince = req.query.idProvince;
    db.query(query, [idProvince], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/getWard", (req, res) => {
    const query = "SELECT * FROM xaphuong where id_quanhuyen = ?";
    const idDistrict = req.query.idDistrict;
    db.query(query, [idDistrict], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post("/user", (req, res) => {
    const q = "INSERT INTO `quanlydatsan`.`taikhoan` (`tentaikhoan`, `matkhau`, `email`, `sdt`, `id_trangthai_taikhoan`, `anhdaidien`, `hoten`, `id_xaphuong`, `id_loaitaikhoan`, `diachicuthe`) VALUES ( ? );"

    const value = [
        req.body.tentaikhoan,
        req.body.matkhau,
        req.body.email,
        req.body.sdt,
        req.body.id_trangthai_taikhoan,
        req.body.anhdaidien,
        req.body.hoten,
        req.body.id_xaphuong,
        req.body.id_loaitaikhoan,
        req.body.diachicuthe
    ]
    db.query(q, [value], (err, data) => {
        if(err) return res.json(err)
        return res.json({
            status: 200,
            content: "Thêm tài khoản thành công"
        })
    });
});
