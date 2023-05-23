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
    const query = "select * from taikhoan"
    db.query(query, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
});

app.get("/football-pitch/:id", (req, res) => {
    const query = "SELECT id_sanbong, tensanbong, id_xaphuong, id_trangthai_sanbong, id_taikhoan, thoigiandong, thoigianmo, hinhanh, gioithieu, diachicuthe , (select json_arrayagg(json_object('id_san', id_san, 'tensan', tensan))   from san where san.id_sanbong = sanbong.id_sanbong group by sanbong.id_sanbong) as 'danhsachsancon' FROM sanbong where id_sanbong = ?"

    const id = req.params.id
    var dataFootballPitches = {}
    dataFootballPitches.status = "200"
    dataFootballPitches.data = {}

    db.query(query, [id], (err, data) => {
        if(err) return res.json(err)
        Object.values(data).forEach(item => {
            dataFootballPitches.data.id_sanbong = item.id_sanbong
            dataFootballPitches.data.tensanbong = item.tensanbong
            dataFootballPitches.data.id_xaphuong = item.id_xaphuong
            dataFootballPitches.data.id_trangthai_sanbong = item.id_trangthai_sanbong
            dataFootballPitches.data.thoigianmo = item.thoigianmo
            dataFootballPitches.data.thoigiandong = item.thoigiandong
            dataFootballPitches.data.hinhanh = item.hinhanh
            dataFootballPitches.data.gioithieu = item.gioithieu
            dataFootballPitches.data.diachicuthe = item.diachicuthe
            dataFootballPitches.data.danhsachsancon = JSON.parse(item.danhsachsancon)
        })
        return res.json(dataFootballPitches)
    })
})

app.get("pitches", (req, res) => {
    const query = ""
    db.query(query, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/football-pitches", (req, res) => {
    const query = "SELECT sanbong.id_sanbong, sanbong.tensanbong, sanbong.diachicuthe, thoigianmo, thoigiandong, gioithieu, trangthai_sanbong,   JSON_ARRAYAGG(JSON_OBJECT('tensan', tensan, 'tenloaisan', tenloaisan, 'thoigianbatdau', thoigianbatdau,  'thoigianketthuc',  thoigianketthuc, 'tenloaisan', tenloaisan, 'giatien', giatien, 'trangthaisan', trangthai_san.trangthai_san)) as danhsachsancon FROM sanbong, san, loaisan, khunggio, loaisankhunggio, taikhoan, sankhunggio, trangthai_san, trangthai_sanbong where sanbong.id_taikhoan = taikhoan.id_taikhoan and  sanbong.id_sanbong = san.id_sanbong and san.id_loaisan = loaisan.id_loaisan and loaisan.id_loaisan = loaisankhunggio.id_loaisan and loaisankhunggio.id_khunggio = khunggio.id_khunggio and sankhunggio.id_san = san.id_san and sankhunggio.id_khunggio = khunggio.id_khunggio and trangthai_san.id_trangthai_san = san.id_trangthai_san and sanbong.id_trangthai_sanbong = trangthai_sanbong.id_trangthai_sanbong group by sanbong.id_sanbong "
    


    var dataFootballPitches = {}
    dataFootballPitches.status = "200"
    dataFootballPitches.data = []
    db.query(query, (err, data) => {
        if(err) return res.json(err)
        
        Object.values(data).forEach(item => {

            dataFootballPitches.data.push({
                "id_sanbong": item.id_sanbong,
                "tensanbong": item.tensanbong,
                "diachicuthe": item.diachicuthe,
                "thoigianmo": item.thoigianmo,
                "thoigiandong": item.thoigiandong,
                "danhsachsancon": JSON.parse(item.danhsachsancon)
            })
        })


        return res.json(dataFootballPitches)
    })
});


app.get("/getPrice", (req, res) => {
    const query = "select * from san, loaisan, loaisankhunggio, khunggio where san.id_loaisan = loaisan.id_loaisan and loaisan.id_loaisan = loaisankhunggio.id_loaisan and loaisankhunggio.id_khunggio = khunggio.id_khunggio and san.id_san = ? and khunggio.id_khunggio=? "
    const idPitch = req.query.idPitch
    const idInterval = req.query.idInterval
    db.query(query,[idPitch, idInterval], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })

})


app.get("/pitch/:id", (req, res) => {
    const query = "SELECT san.id_san,tensan,id_trangthai_san,hinhanh,mota, tenloaisan, thoigianbatdau, thoigianketthuc, trangthai_sankhunggio, giatien, trangthai_sankhunggio.id_trangthai_sankhunggio , khunggio.id_khunggio FROM san, loaisan, sankhunggio, khunggio, trangthai_sankhunggio, loaisankhunggio where san.id_loaisan = loaisan.id_loaisan and san.id_san = sankhunggio.id_san and        khunggio.id_khunggio = sankhunggio.id_khunggio and trangthai_sankhunggio.id_trangthai_sankhunggio = sankhunggio.id_trangthai_sankhunggio and loaisankhunggio.id_khunggio = khunggio.id_khunggio and loaisankhunggio.id_loaisan = loaisan.id_loaisan and san.id_san = ? order by san.id_san"
    const idPitch = req.params.id
    db.query(query,[idPitch], (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})
