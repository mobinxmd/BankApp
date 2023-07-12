///----- Accounts Section ------ ///

const account_1 = {
  owner: "Mobin Mahmood",
  transactions: [800, 350, 650, -435, -344, -756, 600, 1200],
  pin: 123,
};

const account_2 = {
  owner: "Jack doe",
  transactions: [30, -345, 800, -435, -344, -756, 200, 5000],
  pin: 123,
};
const account_3 = {
  owner: "Sarah Samad",
  transactions: [590, -345, 400, -100, -344, -756, -100, 5000],
  pin: 123,
};

const accounts = [account_1, account_2, account_3];

function createUserNames(accounts) {
  accounts.forEach((account) => {
    account.userName = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}
createUserNames(accounts);

///----- Accounts Section End ------ ///

//// ---- Variables Section ----- ////
const container = document.getElementById("container");
const balanceDp = document.getElementById("balance");
const depositBtn = document.getElementById("depositBtn");
const incomeParagraph = document.getElementById("incomeP");
const outgoing = document.getElementById("OutP");
const userInputLogin = document.getElementById("username");
const userPin = document.getElementById("Pin");
const loginPage = document.getElementById("loginPage");
const homePage = document.getElementById("homePage");
const welcomeP = document.getElementById("WelcomeP");
const logOutBtn = document.getElementById("logOut");
const loginBtn = document.getElementById("loginBtn");
const transferAmount = document.getElementById("amount");
const transferTo = document.getElementById("transferAccount");
const transferBtn = document.getElementById("transferBtn");
const deleteUser = document.getElementById("confirmUser");
const deleteUserPin = document.getElementById("confirmPin");
const deleteBtn = document.getElementById("deleteBtn");
const sortBtn = document.getElementById("sortBtn");
const displayDate = document.getElementById("displayDate");
const displayTimer = document.getElementById('timer');

//// ---- Variables Section End ----- ////

//// ---- Event Handle Section  ----- ////
let currentAccount, timer;

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find((acc) => {
    return acc.userName === userInputLogin.value;
  });
  let errorMsg =
    '<p id="Error" class="text-white">You have entered wrong Pin or Username</p>';
  if (currentAccount?.pin === Number(userPin.value)) {
    loginPage.classList.toggle("hidden");
    homePage.classList.toggle("hidden");
    bankApp(currentAccount);
    if(timer) clearInterval(timer);
    timer = logOutTimer()
    userInputLogin.value = "";
    userPin.value = "";
  } else {
    loginBtn.insertAdjacentHTML("afterend", errorMsg);
    userPin.value = null;
    userInputLogin.value = null;
  }
  
});

logOutBtn.addEventListener("click", loginOut);

function loginOut() {
  homePage.classList.toggle("hidden");
  loginPage.classList.toggle("hidden");
}

transferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(transferAmount.value);
  const receiverAcc = accounts.find((acc) => acc.userName === transferTo.value);
  
 
  if (
    receiverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc !== currentAccount.userName
  ) {
    receiverAcc.transactions.push(amount);
    currentAccount.transactions.push(-amount);
    bankApp(currentAccount);

    transferTo.value = null;
    transferAmount.value = null;
    transferTo.blur();
    transferAmount.blur();
    if(timer) clearInterval(timer);
    timer = logOutTimer()
  } 
});

deleteBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    deleteUser.value === currentAccount.userName &&
    Number(deleteUserPin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    loginOut();

    deleteUser.value = null;
    deleteUserPin.value = null;
    deleteUserPin.blur();
  }
});

let sorted = false;

sortBtn.addEventListener("click", function (e) {
  e.preventDefault();
  bankApp(currentAccount, !sorted);
  sorted = !sorted;
  if(timer) clearInterval(timer);
  timer = logOutTimer()
});

const logOutTimer = ()=>{
  let  time = 240;
  const tick = ()=>{
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(Math.floor(time % 60)).padStart(2, 0);

    displayTimer.textContent = `${min}:${sec}`
    if (time === 0) {
      clearInterval(timer);
      loginOut()
    };
    time--
  }
  tick();
  const timer = setInterval(tick, 1000)
  return timer;
}


//// ---- Event Handle Section End ----- ////

/// ---- Main Section --- ///
const bankApp = (user, sort = false) => {
  // setTimeout(loginOut, 10000);
  welcomeP.textContent = user.owner;

  depositBtn.addEventListener("click", depositAmount);
  function depositAmount(e) {
    e.preventDefault();
    const value = Number(document.getElementById("deposit").value);

    if (value > 0) {
      user.transactions.push(value);
      bankApp(user);
      if(timer) clearInterval(timer);
      timer = logOutTimer()
      document.getElementById("deposit").blur();
    }
  }
  let moves = sort
    ? user.transactions.slice().sort((a, b) => a - b)
    : user.transactions;

  document.getElementById("deposit").value = null;
  function createBalance() {
    user.balance = user.transactions.reduce((acc, current) => {
      return acc + current;
    }, 0);
    balanceDp.innerText = `${user.balance} USD`;
  }
  createBalance();

 

  container.innerHTML = "";
  moves.forEach((num, i) => {
    const check = num > 0 ? "DEPOSITED" : "WITHDRAWN";
    const html = `
            <div class="w-full h-30 rounded border-y p-4  shadow">
                <div class="flex justify-between ">
                    <div class=" flex rounded-full items-center">
                    <span class=" p-2 py-3 text-gray text-sm font-bold">${
                      i + 1
                    }</span>
                    <span class=" w-fit h-fit py-1 px-2 ${check} rounded-full text-sm text-white font-bold">${check}</span>
                    </div>
                    <span class=" p-2 font-bold text-lg">$${Math.abs(
                      num
                    )}</span>
                    
                </div>
            </div>
        `;

    container.insertAdjacentHTML("afterbegin", html);
  });
  function IncomeTran(acc) {
    const finalIncome = acc.transactions
      .filter((num) => num > 0)
      .reduce((acc, curr) => acc + curr, 0);
    incomeParagraph.textContent = `${finalIncome}$`;

    const finalOut = acc.transactions
      .filter((num) => num < 0)
      .reduce((acc, curr) => acc + curr, 0);
    outgoing.textContent = `${Math.abs(finalOut)}$`;

    const interest = acc.transactions
      .filter((num) => num > 0)
      .map((num) => (num * 1.1) / 100)
      .filter((int) => int >= 1)
      .reduce((acc, int) => acc + int, 0);

    interestP.textContent = `${+interest.toFixed(1)}$`;
  }
  IncomeTran(user);




  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const local = navigator.language;
  const currentTime = new Intl.DateTimeFormat(local, options).format(now);
  displayDate.textContent = `As of ${currentTime}`
  
};

/// ---- Main Section End --- ///

