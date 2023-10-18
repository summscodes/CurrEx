
const countrydropdown = async () => {
    let url = await fetch('https://restcountries.com/v3.1/all')
    let response = await url.json()

    let result = []

    response.forEach(country => {
        const name = country.name.common
        let currency;
        let currencyname;

        for (let key in country.currencies) {
            if ((country.currencies).hasOwnProperty(key)) {
                currency = key;
                currencyname=country.currencies[key].name
                break; // Break out of the loop after the first key is found
            }
        }
        
        
        result.push({name, currency, currencyname})
    })
    return result
}

const getamount = () => {
    let amountInput = document.getElementById('amount');
    let amount = parseFloat(amountInput.value);
    return isNaN(amount) ? 1 : amount; // Use 1 if the input is not a valid number
};

let country =async()=>{countrydropdown().then(async (countrydata) => {
    let v1;
    let v2;

    for (let i = 1; i <= 2; i++) {
        let dropdown = document.getElementById(`countryDropdown${i}`);
        countrydata.sort((a, b) => a.name.localeCompare(b.name));

        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent = `Choose currency ${i}`;
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        dropdown.appendChild(placeholderOption);

        for (const country of countrydata) {
            const option = document.createElement("option");
            option.value = country.currency;

            option.textContent = `${country.name} -        ${country.currency}`; // Clear existing text content
            dropdown.appendChild(option);
        }

    dropdown.addEventListener("change", function(){
        if(i==1){
            v1=this.value
        }
        if(i==2){
            v2=this.value
        }
              // console.log(`${values[0].v1} and ${values[1].v2}`)
    })
    let convert=document.getElementById('convert')
    convert.addEventListener('click', function(){
        let amount=getamount()
        converter(v1, v2, amount)
    })
    
}
})};
country()
// country().then((result)=>{
//     console.log(result)
//     let c1= result[0].v1
//     let c2= result[0].v2
// })
const converter = async (c1, c2, amount) => {
    try {
        // Convert currency codes to lowercase for consistency
        c1 = c1.toLowerCase();
        c2 = c2.toLowerCase();

        let url = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${c1}.json`);
        let response = await url.json();

        console.log('API Response:', response); // Log the entire response

        // Check if the required conversion data exists
        if (response && response[c1] && response[c1][c2]) {
            let conversionRate = parseFloat(response[c1][c2], 10);
            let result = amount * conversionRate;

            let output = document.getElementById("output");
            output.textContent = `${amount} ${c1.toUpperCase()} = ${result} ${c2.toUpperCase()}`;
        } else {
            console.error(`Failed to fetch or missing data for conversion: ${c1} to ${c2}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
