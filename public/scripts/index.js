const sendMsg = document.getElementById('msg-send');
const inputMsg = document.getElementById('msg-input');
const resMsg = document.getElementById('msg-response');

const sendMsgInfo = async (e) => {
  e.preventDefault();
  if (inputMsg.value === '') { return };
  const res = await fetch('/inputMsg', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parcel: inputMsg.value }),
  });
  const data = await res.json();
  if (data.status === 'recieved') {
    resMsg.textContent = data.message;
  }
};

sendMsg.addEventListener('click', sendMsgInfo);