import express, { json } from "express";
import cors from "cors";
import mysql from "mysql";

const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "xuantruong0307@",
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

app.post("/account", (req, res) => {
    const q = "INSERT INTO `quanlydatsan`.`taikhoan` (`tentaikhoan`, `matkhau`, `email`, `sdt`, `id_trangthai_taikhoan`, `anhdaidien`, `hoten`, `id_xaphuong`, `id_loaitaikhoan`, `diachicuthe`, `ngaysinh`) VALUES ( ? );"

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
        req.body.diachicuthe,
        req.body.ngaysinh
    ]
    db.query(q, [value], (err, data) => {
        if(err) return res.json(err)
        return res.json({
            status: 200,
            content: "Thêm tài khoản thành công"
        })
    });
});

app.delete("/account/:idAccount", (req, res) => {
    const q = "DELETE FROM taikhoan WHERE id_taikhoan = ?"
    const idAccount = req.params.idAccount
    db.query(q, [idAccount]), (err, data) => {
        if (err) return res.json(err)
        return res.json({
            status: 200,
            message: "Xóa tài khoản thành công"
        })
    }
})


app.put("/account/:idAccount", (req, res) => {
    const q = "UPDATE `taikhoan` SET `tentaikhoan` = ?, `matkhau` = ?, `email` = ?, `sdt` = ?, `ngaysinh` = ?, `id_trangthai_taikhoan` = ?, `anhdaidien` = ?, `hoten` = ?, `id_xaphuong` = ?, `id_loaitaikhoan` = ?, `diachicuthe` = ? WHERE (`id_taikhoan` = ?);"


    const idAccount = req.params.idAccount
    const value = [
        req.body.tentaikhoan,
        req.body.matkhau,
        req.body.email,
        req.body.sdt,
        req.body.ngaysinh,
        req.body.id_trangthai_taikhoan,
        req.body.anhdaidien,
        req.body.hoten,
        req.body.id_xaphuong,
        req.body.id_loaitaikhoan,
        req.body.diachicuthe,
        
    ]
    db.query(q, [...value, idAccount]), (err, data) => {
        if (err) return res.json(err)
        return res.json({
            status: 200,
            message: "Cập nhật tài khoản thành công"
        })
    }
})

app.get("/checkExsitsUser", (req, res) => {
    const query = "SELECT * FROM taikhoan where tentaikhoan = ?";
    const username = req.query.username;
    db.query(query, [username], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/accounts", (req, res) => {
    const query = "SELECT * FROM taikhoan;";
    db.query(query,  (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/account", (req, res) => {
    const query = "SELECT tentaikhoan,matkhau,email, anhdaidien,hoten,sdt, substring(ngaysinh, 9, 2) as ngay, substring(ngaysinh, 6, 2) as thang, substring(ngaysinh, 1, 4) as nam , concat( 'Ngày ',substring(ngaysinh, 9, 2), ' tháng ',substring(ngaysinh, 6, 2),' năm ', substring(ngaysinh, 1, 4)) as 'ngaysinh' , concat(diachicuthe, ', ' , tenxaphuong , ', ', tenquanhuyen, ', ', tentinhthanh) as diachi, xaphuong.id_xaphuong, quanhuyen.id_quanhuyen, tinhthanh.id_tinhthanh, diachicuthe, id_loaitaikhoan FROM taikhoan, xaphuong, quanhuyen, tinhthanh where taikhoan.id_xaphuong = xaphuong.id_xaphuong and xaphuong.id_quanhuyen = quanhuyen.id_quanhuyen and quanhuyen.id_tinhthanh = tinhthanh.id_tinhthanh and id_taikhoan = ?"
    const idAccount = req.query.idAccount;
    db.query(query, [idAccount], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// SELECT * FROM san order by id_san desc limit 1
app.get("/footballpitchlast", (req, res) => {
    const query = "SELECT * FROM san order by id_san desc limit 1";
    db.query(query,  (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/accounts-pendding", (req, res) => {
    const query = "SELECT * FROM taikhoan, loaitaikhoan, trangthai_taikhoan WHERE taikhoan.id_loaitaikhoan = loaitaikhoan.id_loaitaikhoan and taikhoan.id_trangthai_taikhoan = trangthai_taikhoan.id_trangthai_taikhoan and trangthai_taikhoan.id_trangthai_taikhoan = 3"
    db.query(query,  (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});




app.post("/booking", (req, res) => {
    const query = "INSERT INTO `quanlydatsan`.`datsan` (`id_san`, `id_taikhoan`, `ngaydat`, `id_trangthai_datsan`, `id_khunggio`) VALUES (?);";
    const values = [
        req.body.id_san,
        req.body.id_taikhoan,
        req.body.ngaydat,
        req.body.id_trangthai_datsan,
        req.body.id_khunggio,
    ]
    db.query(query, [values],  (err, data) => {
        if (err) return res.json(err);
        return res.json({
            status: 200,
            message: "Đặt sân thành công"
        });
    });
});


app.put("/accounts-pendding/:id", (req, res) => {
    const query = "UPDATE taikhoan SET id_trangthai_taikhoan = 1 WHERE  id_taikhoan = ?";
    const tt = 1
    const id = req.query.id
    db.query(query, [id],  (err, data) => {
        if (err) return res.json(err);
        return res.json({
            status: 200,
            message: "Cập nhật thành công"
        });
    });
});

app.get("/history/:idAccount", (req, res) => {
    const query = "SELECT * FROM datsan, san, sanbong, khunggio WHERE datsan.id_san = san.id_san and khunggio.id_khunggio = datsan.id_khunggio and san.id_sanbong = sanbong.id_sanbong and datsan.id_taikhoan = ? and id_trangthai_datsan = 4"
    const idAccount = req.params.idAccount
    db.query(query, [idAccount],  (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});