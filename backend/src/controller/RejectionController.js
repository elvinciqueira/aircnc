const Booking = require("../models/Booking");

module.exports = {
  async store(request, response) {
    const { booking_id } = request.params;

    const booking = await Booking.findById(booking_id).populate("spot");

    booking.approved = false;

    await booking.save();

    const bookinUserSocket = request.connectedUsers[booking.user];

    if (bookinUserSocket) {
      request.io.to(bookinUserSocket).emit("booking_response", booking);
    }

    return response.json(booking);
  }
};
