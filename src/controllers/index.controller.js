const indexCtrl = {};


indexCtrl.renderIndex = (req,res)=>{
    res.render('index')
    //res.send('Hello World')
};

module.exports = indexCtrl;