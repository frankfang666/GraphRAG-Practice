import { useState } from "react";
import { Input } from "antd"; // Import Search from antd
import DisplayArea from './DisplayArea';
import Uploader from './Uploader';
const { Search } = Input;

export default function SearchArea({ model }) {
    const [querytxt, setquerytxt] = useState("");
    const [displaytxts, setdisplaytxts] = useState([]);
    const [toScroll, setToScroll] = useState(false);
    const [loading, setLoading] = useState(false);
    const componentWidth = '100%';

    const handleAreaChange = (e) => {
        setquerytxt(e.target.value);
    };

    const handleSubmit = async (value) => {
        if (value !== "") {
            try {
                const appendedDisplay = [...displaytxts, { "role": "user", "content": value }];
                setdisplaytxts(appendedDisplay);
                setquerytxt("");
                setToScroll(true);
                setLoading(true);

                // const res = await fetch(`http://127.0.0.1:3001/query?query=${encodeURIComponent(value)}`, { method: "GET" });
                const res = await fetch('http://localhost:11434/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: appendedDisplay,
                        stream: true
                    }),
                });

                if (!res.ok) {
                    const errorMessage = await res.text();
                    throw new Error(`Error ${res.status}: ${errorMessage}`);
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let text_stream = "";

                const processStream = async () => {
                    const { done, value } = await reader.read();
                    if (done) {
                        return; // Stream completed (end of recursion)
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    console.log(chunk);
                    try {
                        const chunk_objs = chunk.match(/{[^{}]*}/g).map(json => JSON.parse(json));
                        for (const chunk_obj of chunk_objs) {
                            text_stream += chunk_obj.content
                        }
                    } catch (error) {
                        console.log(error)
                    }

                    setdisplaytxts([...appendedDisplay, { "role": "assistant", "content": text_stream }]);

                    // Continue reading the stream
                    setTimeout(processStream, 2000);
                    processStream();  // recursive call
                };

                processStream();
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    width: '50%'  // 调整宽度
                }}
        >
            <DisplayArea 
                displaytxts={displaytxts} 
                toScroll={toScroll} 
                setToScroll={setToScroll} 
                componentWidth={componentWidth}
                style={{ 
                    backgroundColor: "#F8F8F8",
                    width: '100%', // 调整宽度
                    height: '100%', // 调整高度
                    border: '1px solid #F8F8F8', 
                    position: 'relative', 
                    overflowY: "scroll",
                }}
            />
            <Search
                placeholder="Enter your query"
                loading={loading}
                enterButton={'搜索'}
                size="large"
                value={querytxt}
                onChange={handleAreaChange}
                onSearch={handleSubmit}
                suffix={<Uploader />}
                style={{ width: componentWidth, height: '8%', marginTop: '2%' }}
            />
        </div>
    );
}