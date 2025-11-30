

const QuestionCard = ({data, onAnswer, showFeedback,  selected, current, total}) => {

    const { question, options, answer} = data

   const getOption = (option) => {
    if (!showFeedback) {
        return "bg-indigo-700 hover:bg-indigo-600 hover:scale-[1.01]";
    }

    if (option === answer) {
        return "bg-green-600";
    }

    if (option === selected) {
        return "bg-rose-600";
    }

    return "bg-gray-700";
};

    

    return(<>
        <div className="text-red-500 bg-gray-600 p-4 rounded-2xl shadow-lg w-full max-w-xl border border-gray-700 text-center">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium text-gray-300">Question: {current + 1} of {total}</h1>
                <span className="text-sm bg-gray-400 py-3 px-4 rounded-full text-white">{selected ? Math.round(((current + 1)/total) * 100) + "% complete": Math.round(((current)/total) * 100) + "% complete"}</span>
                </div>                 
            <p className="text-xl font-medium mb-6">{question}</p>
           <div className="grid gap-3 mt-2">
            {options.map(
                (option, index) => (
                    //the disabled property is connected to the showfeedback. and if the showfeedback is true, the disabled property in the style of the option buttons will have a gray background color
                    <button className={`${getOption(option)} py-3 px-4 text-white cursor-pointer rounded-lg text-left disabled:bg-gray-900`} key={index} onClick={() => onAnswer(option)}>{option}</button>
                )
            )}
           </div>
        </div>
        </>
    );

};

export default QuestionCard;