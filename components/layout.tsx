
type PropType = {
    children:any
}

export default function Layout({children} : PropType){

    return (
        <div className="layout">
          {children}
        </div>
    )
}