
import { _decorator, Component, Node, Camera, geometry, input, Input, EventTouch, Vec3, PhysicsSystem2D } from 'cc';

const { ccclass, property } = _decorator;

@ccclass( 'Move' )
export class Move extends Component
{
    @property( Camera )
    readonly cameraCom!: Camera;

    @property( Node )
    public Parent!: Node

    @property( Node )
    public targetNode!: Node

    private _ray: geometry.Ray = new geometry.Ray();

    _position = new Vec3();

    start ()
    {
        Vec3.copy( this._position, this.targetNode.position );
    }

    onEnable ()
    {
        input.on( Input.EventType.TOUCH_START, this.onTouchStart, this );
        input.on( Input.EventType.TOUCH_MOVE, this.onTouchMove, this );
        input.on( Input.EventType.TOUCH_END, this.onTouchEnd, this );
        input.on( Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this );
    }

    onDisable ()
    {
        input.off( Input.EventType.TOUCH_START, this.onTouchStart, this );
        input.off( Input.EventType.TOUCH_MOVE, this.onTouchMove, this );
        input.off( Input.EventType.TOUCH_END, this.onTouchEnd, this );
        input.off( Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this );
    }


    onTouchStart ( event: EventTouch )
    {


    }

    onTouchMove ( event: EventTouch )
    {
        const touch = event.touch!;
        // this.cameraCom.screenPointToRay( touch.getLocationX(), touch.getLocationY(), this._ray );
        // if ( PhysicsSystem2D.instance.raycast( this._ray ) )
        // {
        //     const raycastResults = PhysicsSystem2D.instance.raycastResults;
        //     for ( let i = 0; i < raycastResults.length; i++ )
        //     {
        //         const item = raycastResults[ i ];
        //         if ( item.collider.node == this.targetNode )
        //         {
        //             this.targetNode.worldPosition = new Vec3( item.hitPoint.x, 0, item.hitPoint.z );
        //             break;
        //         }
        //     }
        // }
    }

    onTouchEnd ( event: EventTouch )
    {
        this.targetNode.parent = this.Parent;
    }

    onTouchCancel ( event: EventTouch )
    {
        this.targetNode.parent = this.Parent;
    }
}
