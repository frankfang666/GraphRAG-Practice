import {useEffect, useRef, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import { CopyOutlined, CloseOutlined } from '@ant-design/icons'
import { Tooltip, Button } from 'antd' // 引入 Tooltip 组件

export default function DisplayArea({ displaytxts, toScroll, setToScroll, componentWidth, style }) {
    const scrollableDivRef = useRef(null)
    const [showPopup, setShowPopup] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null) // 用于跟踪悬停的气泡索引

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
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '0%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    zIndex: 1000
                }}>
                    内容已复制到剪贴板
                </div>
            )}
            <Button style={{ position: 'relative', top: '10px', left: '92%', backgroundColor: 'transparent', border: 'none' }} icon={<CloseOutlined />} />
            {
                displaytxts.map((x, i) => {
                    return (
                        <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }} key={i}>
                            <li
                                style={{
                                    display: 'flex',
                                    justifyContent: x.role === 'user' ? 'flex-end' : 'flex-start',
                                    position: 'relative' // 添加相对定位
                                }}
                                onMouseEnter={() => setHoveredIndex(i)} // 鼠标进入时设置悬停索引
                                onMouseLeave={() => setHoveredIndex(null)} // 鼠标离开时重置悬停索引
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        padding: '10px',
                                        display: 'inline-block',
                                        backgroundColor: x.role === 'user' ? '#E8E8E8' : '#229FFF',
                                        borderRadius: '10px',
                                        maxWidth: componentWidth,
                                        color: x.role === 'user' ? 'black' : 'white',
                                        wordBreak: 'break-word',
                                        marginTop: '20px',
                                        marginBottom: '10px',
                                        marginLeft: x.role === 'user' ? '0px' : '10px',
                                        marginRight: x.role === 'assistant' ? '10px' : '0px',
                                        overflow: 'hidden',
                                    }}
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
                                        style={{ 
                                            width: '40px', 
                                            height: '40px', 
                                            borderRadius: '50%', 
                                            marginTop: '15px',
                                            marginLeft: '10px', 
                                            marginRight: '10px' 
                                        }} 
                                    />)
                                }
                                {
                                    (<Tooltip title="复制">
                                        <button 
                                            onClick={() => copyToClipboard(x.content)} 
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'gray',
                                                position: 'absolute',
                                                bottom: '5px', // 调整按钮位置到气泡外的左下角
                                                left: x.role === 'assistant' ? '10px' : '83%',
                                                transform: 'translateY(100%)',
                                                display: hoveredIndex === i ? 'block' : 'none' // 根据悬停索引控制显示
                                            }}
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