import {useEffect, useRef, useState, useContext} from 'react'
import ReactMarkdown from 'react-markdown'
import { CopyOutlined, CloseOutlined } from '@ant-design/icons'
import { Tooltip, Button } from 'antd' // 引入 Tooltip 组件
import '../styles/DisplayArea.css';
import MyContext from '../../MyContext';

export default function DisplayArea({ displaytxts, toScroll, setToScroll, componentWidth, style }) {
    const scrollableDivRef = useRef(null)
    const [showPopup, setShowPopup] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null) // 用于跟踪悬停的气泡索引
    const { setSearch, setSelectedKeys } = useContext(MyContext);

    useEffect(()=>{
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight
            setToScroll(false)
        }, [displaytxts, toScroll, setToScroll]); // 添加 displaytxts 作为依赖

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowPopup(true)
            setTimeout(() => {
                setShowPopup(false)
            }, 2000) // 显示2秒后隐藏
        }).catch(err => {
            console.error('复制失败', err);
        });
    }

    return (
        <div 
            ref={scrollableDivRef}
            style={style}
        >
            {showPopup && (
                <div className="popup">
                    内容已复制到剪贴板
                </div>
            )}
            <Button className="close-button" type="text" icon={<CloseOutlined />} onClick={() => {setSearch(false); setSelectedKeys([])}} />
            {
                displaytxts.map((x, i) => {
                    return (
                        <ul className="message-list" key={i}>
                            <li
                                className={`message-item ${x.role}`}
                                onMouseEnter={() => setHoveredIndex(i)} // 鼠标进入时设置悬停索引
                                onMouseLeave={() => setHoveredIndex(null)} // 鼠标离开时重置悬停索引
                            >
                                <div
                                    className={`message-content ${x.role}`}
                                    style={{ maxWidth: componentWidth }}
                                >
                                    <ReactMarkdown components={{p: ({ children }) => <span style={{ margin: 0, wordBreak: 'break-word', maxWidth: '100%' }}>{children}</span>}}>
                                        {x.content}
                                    </ReactMarkdown>
                                </div>
                                {
                                    x.role === 'user' && 
                                    (<img 
                                        src='user.ico' 
                                        alt="avatar" 
                                        className="avatar"
                                    />)
                                }
                                {
                                    (<Tooltip title="复制">
                                        <button 
                                            onClick={() => copyToClipboard(x.content)} 
                                            className={`copy-button ${hoveredIndex === i ? 'visible' : ''}`}
                                            style={{ left: x.role === 'assistant' ? '10px' : '83%' }}
                                        >
                                            <CopyOutlined style={{ fontSize: '16px' }} />
                                        </button>
                                    </Tooltip>)
                                }
                            </li>
                        </ul>
                    )
                })
            }
        </div>
    )
}