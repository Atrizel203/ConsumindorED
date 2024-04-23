import amqplib from "amqplib/callback_api";

amqplib.connect("amqp://18.209.192.241/", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "base";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      async function (msg : any) {
         try {
          console.log(msg.content.toString());
           const headers = {
             "Content-Type": "application/json",
           };
           const req = {
            method: "POST",
             body: msg.content.toString(),
             headers,
           };
           const result = await fetch(
             "http://3.224.188.187:4000/api/payments",
             req
           );
           const data=result.json();
           console.log(data);
         } catch (error: any) {
           throw new Error(error.message);
         }
      },
      {
        noAck: true,
      }
    );
  });
});
