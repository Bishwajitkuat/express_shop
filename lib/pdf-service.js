const PDFDocument = require("pdfkit");

function buildInvioice(order, dataCallback, endCallback) {
  const doc = new PDFDocument();
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  doc.fontSize(25).text("ExpressShop", {
    width: 410,
    align: "center",
  });
  doc.fontSize(12).text(`Expresskatu 7, 00790,`, {
    width: 410,
    align: "center",
  });
  doc.fontSize(12).text(`Helinki, Finland`, {
    width: 410,
    align: "center",
  });
  doc.moveDown(2);
  doc.fontSize(12).text(`Order Id: ${order._id.toString()}`, {
    width: 410,
    align: "left",
  });
  doc.fontSize(12).text(`Order date: ${order.date}`, {
    width: 410,
    align: "left",
  });
  doc.moveDown();
  doc
    .moveTo(50, doc.y)
    .dash(3, { space: 3 })
    .lineTo(doc.page.width - 100, doc.y)
    .stroke();
  doc.moveDown();
  for (let item of order.items) {
    doc.fontSize(15).text(`${item.title}   X ${item.quantity}`, {
      width: 410,
      align: "left",
      continued: true,
    });
    doc.fontSize(15).text(`${item.price * item.quantity}€`, {
      width: 410,
      align: "right",
    });
    doc.moveDown();
  }
  doc
    .moveTo(50, doc.y)
    .dash(3, { space: 3 })
    .lineTo(doc.page.width - 100, doc.y)
    .stroke();

  doc.moveDown();
  doc.fontSize(18).text(`Total`, {
    width: 410,
    align: "left",
    continued: true,
  });
  doc.fontSize(18).text(`${order.totalPrice}€`, {
    width: 410,
    align: "right",
  });

  doc.moveDown();
  doc.fontSize(15).text(`Amount to pay: ${order.totalPrice}€`, {
    width: 410,
    align: "left",
  });
  doc.fontSize(15).text(`Payment: pay on delivery`, {
    width: 410,
    align: "left",
  });
  doc.end();
}

module.exports = { buildInvioice };
