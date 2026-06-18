type SimpleComponentProps = {
    title?: string;
};

function SimpleComponent(props: SimpleComponentProps) {
    return (
        <div>
            <h1>{props.title ?? "Default Title"}</h1>
        </div>
    );
}

export default SimpleComponent;